import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CropsService } from './crops.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Experts } from '../expert/entities/expert.entity';
import { DiseasesService } from '../diseases/diseases.service';
import { SolutionsService } from '../solutions/solutions.service';
import {
  MlClientService,
  MlPredictionResult,
} from '../../common/services/ml-client.service';
import { CreateCropDto } from './dtos';
import { ReportsService } from '../reports/reports.service';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class CropsMlService {
  private readonly logger = new Logger(CropsMlService.name);
  constructor(
    private readonly cropsService: CropsService,
    private readonly diseasesService: DiseasesService,
    private readonly solutionsService: SolutionsService,
    private readonly mlClient: MlClientService,
    private readonly reportsService: ReportsService,
    private readonly historiesService: HistoriesService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Experts)
    private readonly expertsRepository: Repository<Experts>,
  ) { }

  async predictAndCreateCrop(dto: CreateCropDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image file (file) is required');

    // Call ML service
    this.logger.log('Calling ML service /predict');
    const prediction = await this.mlClient.predict(file);
    this.logger.debug(`ML prediction received: ${JSON.stringify(prediction)}`);

    // Decide names/descriptions
    const diseaseName = prediction.className || prediction.disease || 'Unknown';
    const diseaseDescription = prediction.description || null;
    const recommendedAction = prediction.recommended_action || null;
    this.logger.log(`Upserting disease: ${diseaseName}`);

    // Upsert disease and create solution (if provided)
    const disease = await this.diseasesService.findOrCreateByName(
      diseaseName,
      diseaseDescription,
    );
    this.logger.log(`Using disease id=${disease.id}`);

    let solution = null as any;
    if (recommendedAction) {
      // Create a solution row for this disease per prediction
      solution = await this.solutionsService.createForDisease(
        disease,
        recommendedAction,
      );
      this.logger.log(`Created solution id=${solution.id} for disease id=${disease.id}`);
    }

    // Create the crop with disease_id and uploaded image
    let crop = await this.cropsService.create(
      { ...dto },
      { file, diseaseId: disease.id },
    );
    this.logger.log(`Created crop id=${crop.id} with disease_id=${crop.disease_id}`);

    // Safety fallback: if disease_id wasn't persisted for any reason, patch it
    if (!crop.disease_id && disease?.id) {
      this.logger.warn(
        `Crop ${crop.id} saved without disease_id, attempting update to ${disease.id}`,
      );
      try {
        crop = await this.cropsService.update(
          crop.id,
          { disease_id: disease.id } as any,
          {},
        );
        this.logger.log(
          `Crop ${crop.id} updated with disease_id=${crop.disease_id}`,
        );
      } catch (e) {
        this.logger.error(
          `Failed to update crop ${crop.id} with disease_id=${disease.id}: ${e instanceof Error ? e.message : e}`,
        );
      }
    }

    // Determine if provided user_id belongs to a Users record. If it's an
    // Experts id, we won't attach it to reports or create a history entry
    // (those tables reference Users only).
    let attachUserId: string | null = null;
    if (dto.user_id) {
      const foundUser = await this.usersRepository.findOne({ where: { id: dto.user_id } });
      if (foundUser) {
        attachUserId = dto.user_id;
      } else {
        // if it's not a user but exists in experts, we intentionally leave
        // attachUserId as null so reports.user stays null and history is skipped.
        const foundExpert = await this.expertsRepository.findOne({ where: { id: dto.user_id } });
        if (!foundExpert) {
          // neither user nor expert -> treat as invalid id
          throw new BadRequestException('User not found');
        }
      }
    }

    // Create a report for this scan
    const report = await this.reportsService.createReport({
      user_id: attachUserId,
      crop,
      disease,
      solution: solution ?? null,
      report_url: null,
      confidence: prediction.confidence,
      severity: prediction.severity,
    });
    this.logger.log(`Created report id=${report.id} for crop id=${crop.id}`);

    // Auto-record a history entry for the uploader if user_id is present
    let history: any = null;
    if (attachUserId) {
      try {
        history = await this.historiesService.recordView({
          user_id: attachUserId,
          report_id: report.id,
          viewed_at: new Date(),
        });
        this.logger.log(`Created history id=${history.id} for report id=${report.id}`);
      } catch (e) {
        // Non-blocking: history creation failure shouldn't break main flow
        this.logger.warn(`Failed to create history for report id=${report.id}: ${e instanceof Error ? e.message : e}`);
      }
    }

    return { crop, prediction, disease, solution, report, history };
  }
}
