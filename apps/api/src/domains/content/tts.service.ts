import { Injectable, Logger } from '@nestjs/common';
import * as googleTTS from 'google-tts-api';
import * as fs from 'fs';
import * as path from 'path';
import { db, newsTable } from '@novanews/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class TTSService {
  private readonly logger = new Logger(TTSService.name);
  private readonly audioDir = path.join(process.cwd(), 'public', 'audio');

  constructor() {
    // Asegurar que el directorio de audios exista
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
  }

  async generateAudioForArticle(newsId: string, text: string) {
    this.logger.log(`[TTS] Iniciando generación de audio para artículo ${newsId}`);
    try {
      // 1. Extraer el base64 usando google-tts-api (soporta hasta 200 caracteres, pero con getAllAudioBase64 se pueden combinar más)
      // Usamos el idioma español 'es'
      const base64Audios = await googleTTS.getAllAudioBase64(text, {
        lang: 'es',
        slow: false,
        host: 'https://translate.google.com',
        splitPunct: ',.?',
      });

      // 2. Combinar los buffers
      const buffers = base64Audios.map(audio => Buffer.from(audio.base64, 'base64'));
      const finalBuffer = Buffer.concat(buffers);

      // 3. Guardar el archivo en el volumen local
      const fileName = `${newsId}.mp3`;
      const filePath = path.join(this.audioDir, fileName);
      fs.writeFileSync(filePath, finalBuffer);

      // 4. Generar URL pública
      const audioUrl = `/audio/${fileName}`; // Será servido por ServeStaticModule

      // 5. Actualizar la base de datos
      await db.update(newsTable)
        .set({ audioUrl })
        .where(eq(newsTable.id, newsId));

      this.logger.log(`[TTS] Audio generado y guardado exitosamente: ${audioUrl}`);
    } catch (error) {
      this.logger.error(`[TTS] Error generando audio para ${newsId}: ${error}`);
    }
  }
}
