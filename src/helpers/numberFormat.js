export default function numberFormat(num) {
  return new Intl.NumberFormat().format(num)
}
