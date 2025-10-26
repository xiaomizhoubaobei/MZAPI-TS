/*!
 * MZAPI TypeScript SDK
 * Copyright (C) 2025-present Qixiaoxiao <qixiaoxin@stu.sqxy.edu.cn>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * 文字识别结果
 *
 * 被如下接口引用：GeneralAccurateOCR, GeneralBasicOCR, GeneralEfficientOCR, GeneralFastOCR。
 **/
export interface TextDetection {
    DetectedText: string; // 识别出的文本行内容
    Confidence: number; // 置信度 0 ~100
    Polygon: Array<Coord> | null; // 文本行坐标，以四个顶点坐标表示；可能为 null
    AdvancedInfo: string; // 扩展字段，GeneralBasicOcr 接口返回段落信息 Parag，包含 ParagNo
    ItemPolygon: ItemCoord; // 文本行在旋转纠正后的图像像素坐标（左上角x, 左上角y, 宽width, 高height）
    Words: Array<DetectedWords>; // 单字信息（单字字符+置信度），GeneralBasicOCR、GeneralAccurateOCR 支持
    WordCoordPoint: Array<DetectedWordCoordPoint>; // 单字在原图中的四点坐标，GeneralBasicOCR、GeneralAccurateOCR 支持
}

/**
 * 坐标
 *
 * 被如下接口引用：AdvertiseOCR, ArithmeticOCR, CarInvoiceOCR, EnglishOCR, ExtractDocBasic, ExtractDocMulti, ExtractDocMultiPro, GeneralAccurateOCR, GeneralBasicOCR, GeneralEfficientOCR, GeneralFastOCR, GeneralHandwritingOCR, HandwritingEssayOCR, QrcodeOCR, QuestionOCR, QuestionSplitLayoutOCR, QuestionSplitOCR, RecognizeFormulaOCR, RecognizeGeneralCardWarn, RecognizeGeneralInvoice, RecognizeGeneralTextImageWarn, RecognizeTableAccurateOCR, RecognizeTableOCR, TableOCR, VatInvoiceOCR。
 **/
export interface Coord {
    X: number; // 横坐标
    Y: number; // 纵坐标
}

/**
 * 文本行在旋转纠正之后的图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
 *
 * 被如下接口引用：ArithmeticOCR, BusinessCardOCR, EduPaperOCR, GeneralAccurateOCR, GeneralBasicOCR, GeneralEfficientOCR, GeneralFastOCR, SmartStructuralOCR。
 **/
export interface ItemCoord {
    X: number; // 左上角x
    Y: number; // 左上角y
    Width: number; // 宽width
    Height: number; // 高height
}

/**
 * 识别出来的单字信息包括单字（包括单字Character和单字置信度confidence）
 *
 * 被如下接口引用：GeneralAccurateOCR, GeneralBasicOCR, GeneralEfficientOCR, GeneralFastOCR。
 **/
export interface DetectedWords {
    Confidence: number; // 置信度 0 ~100
    Character: string; // 候选字Character
}

/**
 * 单字在原图中的坐标，以四个顶点坐标表示，以左上角为起点，顺时针返回。
 *
 * 被如下接口引用：GeneralAccurateOCR, GeneralBasicOCR, GeneralEfficientOCR, GeneralFastOCR。
 **/
export interface DetectedWordCoordPoint {
    WordCoordinate: Array<Coord>; // 单字在原图中的坐标，以四个顶点坐标表示，以左上角为起点，顺时针返回
}