import type { PricedLine } from './pricing.js';

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const COCOA = '#3B2A22';
const COCOA_DARK = '#2E211A';
const CREAM = '#FBF6EE';
const BEIGE = '#E8DCC8';
const GOLD = '#C9A24B';

export interface EmailOrderData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lines: PricedLine[];
  couponCode: string | null;
  discount: number;
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: string;
  paymentId: string;
  shippingAddress: { address: string; city: string; zip: string };
  siteUrl: string;
  supportEmail: string;
}

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};font-family:${FONT_STACK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${COCOA};border-radius:28px 28px 0 0;padding:28px 32px;">
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;border-radius:50%;background-color:${GOLD};text-align:center;vertical-align:middle;font-weight:800;color:${COCOA_DARK};font-size:16px;">B</td>
                  <td style="padding-left:10px;font-size:20px;font-weight:800;color:${CREAM};letter-spacing:-0.3px;">BetterBite</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:0 0 28px 28px;box-shadow:0 8px 30px -10px rgba(59,42,34,0.15);">
          <tr>
            <td style="padding:36px 32px;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:20px 8px;text-align:center;font-size:12px;color:#8a7768;">
              &copy; ${new Date().getFullYear()} BetterBite. Mini protein bites, made with real cocoa and real protein.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function itemsTable(lines: PricedLine[]): string {
  const rows = lines
    .map(
      (l) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BEIGE};font-size:14px;color:${COCOA};">${l.name} &times; ${l.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${BEIGE};font-size:14px;color:${COCOA};text-align:right;font-weight:700;">&#8377;${l.price * l.qty}</td>
      </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${rows}</table>`;
}

function summaryRow(label: string, value: string, opts?: { bold?: boolean; accent?: boolean }): string {
  const weight = opts?.bold ? '800' : '600';
  const color = opts?.accent ? GOLD : COCOA;
  const size = opts?.bold ? '16px' : '14px';
  return `
    <tr>
      <td style="padding:4px 0;font-size:${size};color:${opts?.bold ? COCOA : '#8a7768'};font-weight:${opts?.bold ? '700' : '500'};">${label}</td>
      <td style="padding:4px 0;font-size:${size};color:${color};text-align:right;font-weight:${weight};">${value}</td>
    </tr>`;
}

function button(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="border-radius:999px;background-color:${COCOA};">
          <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:${CREAM};text-decoration:none;border-radius:999px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

export function renderCustomerEmail(data: EmailOrderData): string {
  const firstName = data.customerName.trim().split(' ')[0] || 'there';
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${COCOA};">Hi ${firstName}, your order is confirmed! 🎉</h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c4c3f;">
      Thank you for choosing BetterBite. Your sweet escape is on its way — here's everything about your order.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};border-radius:16px;padding:16px 20px;margin-bottom:20px;">
      ${summaryRow('Order ID', data.orderNumber)}
      ${summaryRow('Order Date', data.orderDate)}
      ${summaryRow('Payment Method', data.paymentMethod)}
    </table>

    <h2 style="margin:0 0 4px;font-size:14px;font-weight:800;color:${COCOA};text-transform:uppercase;letter-spacing:0.06em;">Items</h2>
    ${itemsTable(data.lines)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid ${BEIGE};padding-top:12px;">
      ${summaryRow('Subtotal', `&#8377;${data.subtotal}`)}
      ${data.couponCode ? summaryRow(`Discount (${data.couponCode})`, `-&#8377;${data.discount}`, { accent: true }) : ''}
      ${summaryRow('Shipping', data.shippingCost === 0 ? 'Free' : `&#8377;${data.shippingCost}`)}
      ${summaryRow('Amount Paid', `&#8377;${data.grandTotal}`, { bold: true })}
    </table>

    <h2 style="margin:24px 0 4px;font-size:14px;font-weight:800;color:${COCOA};text-transform:uppercase;letter-spacing:0.06em;">Shipping Address</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#5c4c3f;">
      ${data.customerName}<br />
      ${data.shippingAddress.address}, ${data.shippingAddress.city} ${data.shippingAddress.zip}
    </p>

    <h2 style="margin:24px 0 4px;font-size:14px;font-weight:800;color:${COCOA};text-transform:uppercase;letter-spacing:0.06em;">Estimated Delivery</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#5c4c3f;">3–5 business days</p>

    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a7768;">
      Questions about your order? Reach us anytime at
      <a href="mailto:${data.supportEmail}" style="color:${COCOA};font-weight:700;">${data.supportEmail}</a>.
    </p>

    ${button('Continue Shopping', data.siteUrl)}
  `;
  return shell('Your BetterBite Order is Confirmed!', body);
}

export function renderAdminEmail(data: EmailOrderData): string {
  const body = `
    <h1 style="margin:0 0 20px;font-size:20px;font-weight:800;color:${COCOA};">New BetterBite Order Received</h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};border-radius:16px;padding:16px 20px;margin-bottom:20px;">
      ${summaryRow('Order ID', data.orderNumber)}
      ${summaryRow('Date &amp; Time', data.orderDate)}
      ${summaryRow('Customer Name', data.customerName)}
      ${summaryRow('Customer Email', data.customerEmail)}
      ${summaryRow('Phone Number', data.customerPhone)}
      ${summaryRow('Razorpay Payment ID', data.paymentId)}
    </table>

    <h2 style="margin:0 0 4px;font-size:14px;font-weight:800;color:${COCOA};text-transform:uppercase;letter-spacing:0.06em;">Products Ordered</h2>
    ${itemsTable(data.lines)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid ${BEIGE};padding-top:12px;">
      ${summaryRow('Subtotal', `&#8377;${data.subtotal}`)}
      ${data.couponCode ? summaryRow(`Coupon Used (${data.couponCode})`, `-&#8377;${data.discount}`, { accent: true }) : summaryRow('Coupon Used', 'None')}
      ${summaryRow('Amount Paid', `&#8377;${data.grandTotal}`, { bold: true })}
    </table>

    <h2 style="margin:24px 0 4px;font-size:14px;font-weight:800;color:${COCOA};text-transform:uppercase;letter-spacing:0.06em;">Shipping Address</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#5c4c3f;">
      ${data.customerName}<br />
      ${data.shippingAddress.address}, ${data.shippingAddress.city} ${data.shippingAddress.zip}
    </p>
  `;
  return shell('New BetterBite Order Received', body);
}
