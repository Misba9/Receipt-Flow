import type { Borders, Font, Fill, Alignment, Worksheet, Workbook } from 'exceljs'

export const EXCEL_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export const headerFill: Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1A73F5' },
}

export const headerFont: Partial<Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
  name: 'Calibri',
}

export const titleFont: Partial<Font> = {
  bold: true,
  size: 16,
  color: { argb: 'FF0F172A' },
  name: 'Calibri',
}

export const metaFont: Partial<Font> = {
  size: 10,
  color: { argb: 'FF64748B' },
  name: 'Calibri',
}

export const thinBorder: Partial<Borders> = {
  top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
}

export const currencyFormat = '"$"#,##0.00'
export const dateFormat = 'yyyy-mm-dd'
export const dateTimeFormat = 'yyyy-mm-dd hh:mm'

export function styleHeaderRow(sheet: Worksheet, rowNumber: number, columnCount: number) {
  const row = sheet.getRow(rowNumber)
  row.height = 22
  for (let col = 1; col <= columnCount; col += 1) {
    const cell = row.getCell(col)
    cell.fill = headerFill
    cell.font = headerFont
    cell.border = thinBorder
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    } as Partial<Alignment>
  }
}

export function autofitColumns(sheet: Worksheet, min = 12, max = 42) {
  sheet.columns.forEach((column) => {
    if (!column) return
    let longest = min
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value
      const text =
        value == null
          ? ''
          : typeof value === 'object' && value !== null && 'text' in value
            ? String((value as { text: string }).text)
            : String(value)
      longest = Math.min(max, Math.max(longest, text.length + 2))
    })
    column.width = longest
  })
}

export function addExportTitle(
  sheet: Worksheet,
  title: string,
  subtitle: string,
  columnCount: number,
) {
  sheet.mergeCells(1, 1, 1, columnCount)
  const titleCell = sheet.getCell(1, 1)
  titleCell.value = title
  titleCell.font = titleFont
  titleCell.alignment = {
    vertical: 'middle',
    horizontal: 'left',
  } as Partial<Alignment>

  sheet.mergeCells(2, 1, 2, columnCount)
  const metaCell = sheet.getCell(2, 1)
  metaCell.value = subtitle
  metaCell.font = metaFont

  sheet.getRow(1).height = 26
  sheet.getRow(2).height = 18
}

export async function createWorkbook(): Promise<Workbook> {
  const ExcelJS = await import('exceljs')
  return new ExcelJS.Workbook()
}

export async function downloadWorkbook(workbook: Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: EXCEL_MIME })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function stampWorkbook(workbook: Workbook, reportName: string) {
  workbook.creator = 'ReceiptFlow'
  workbook.lastModifiedBy = 'ReceiptFlow'
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.title = reportName
  workbook.company = 'ReceiptFlow'
}
