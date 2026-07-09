import prisma from '../../../config/database.js';

export class TrackingRepository {
  async logActivity(data) {
    return prisma.emailActivity.create({ data });
  }

  async findActivityByProviderId(providerMsgId) {
    return prisma.emailActivity.findFirst({
      where: { providerMsgId }
    });
  }
}

export class AiAnalysisRepository {
  async saveAnalysis(data) {
    return prisma.aiAnalysis.create({ data });
  }

  async findByProspectId(prospectId) {
    return prisma.aiAnalysis.findMany({
      where: { prospectId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
