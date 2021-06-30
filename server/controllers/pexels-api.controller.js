import { createClient } from 'pexels';
import { PEXELS_API_KEY } from '../utils/config.js';


const client = createClient(PEXELS_API_KEY);

export const getImages = async (req, res) => {
  /**
   * Supported query parameters:
   * search: The category to search for
   * orientation: landscape, portrait, square
   * size: large(24MP), medium(12MP), small(4MP)
   * color: red, orange, yellow, green, turquoise, blue, 
   *   violet, pink, brown, black, gray, white or hexidecimal color code
   * locale: 'en-US' 'pt-BR' 'es-ES' 'ca-ES' 'de-DE' 'it-IT' 'fr-FR' 
   *   'sv-SE' 'id-ID' 'pl-PL' 'ja-JP' 'zh-TW' 'zh-CN' 'ko-KR' 'th-TH' 
   *   'nl-NL' 'hu-HU' 'vi-VN' 'cs-CZ' 'da-DK' 'fi-FI' 'uk-UA' 'el-GR' 
   *   'ro-RO' 'nb-NO' 'sk-SK' 'tr-TR' 'ru-RU'
   * page: pagination number
   * per_page: images per page
   */
  let photos = await client.photos.search({ ...req.query });
  return res.status(200).json({ photos: photos });
}