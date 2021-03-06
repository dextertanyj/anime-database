import { Episode, File as FileType } from '@prisma/client';
import { Context } from '../../utils';

export const File = {
  async episode(
    parent: FileType,
    _args: unknown,
    ctx: Context
  ): Promise<Episode> {
    const episode = await ctx.prisma.episode.findUnique({
      where: { id: parent.episodeId },
    });
    if (episode) {
      return episode;
    } else {
      throw new Error('Episode not found.');
    }
  },
};
