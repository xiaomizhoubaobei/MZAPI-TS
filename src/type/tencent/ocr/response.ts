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

import {TextDetection} from './type'

/**
 *  通用印刷体OCR响应体
 */
export  interface GeneralBasicOCRResponse {
    /**
     *  图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看如何纠正倾斜文本
     * 示例值：6.
     */
    Angle: string

    /**
     *  检测到的语言类型，目前支持的语言类型参考入参LanguageType说明。
     * 示例值：zh
     */
    Language: string

    /**
     * 图片为PDF时，返回PDF的总页数，默认为0
     * 示例值：0
     */
    PdfPageSize: number

    /**
     * 唯一请求 ID，由服务端生成，每次请求都会返回（若请求因其他原因未能抵达服务端，则该次请求不会获得 RequestId）。
     * 定位问题时需要提供该次请求的 RequestId。
     */
    RequestId: string

    /**
     * 检测到的文本信息，包括文本行内容、置信度、文本行坐标以及文本行旋转纠正后的坐标，具体内容请点击左侧链接。
     */
    TextDetections: Array<TextDetection>
}