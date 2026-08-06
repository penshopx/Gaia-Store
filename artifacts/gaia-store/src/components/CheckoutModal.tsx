import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { X, ShoppingBag, CreditCard, MessageCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ADMIN_WA_NUMBER } from '@/lib/config';
import type { Product } from '@/lib/products';

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [formData, setFormData] = useState({ companyName: '', picName: '', whatsapp: '' });
  const [paymentLinkClicked, setPaymentLinkClicked] = useState(false);

  if (!product) return null;

  const hasPaymentLink = !!product.scalev_payment_link;

  const handlePaymentLink = () => {
    window.open(product.scalev_payment_link, '_blank');
    setPaymentLinkClicked(true);
  };

  const handleCheckoutWA = (e: React.FormEvent) => {
    e.preventDefault();
    const { companyName, picName, whatsapp } = formData;
    if (!companyName || !picName || !whatsapp) {
      alert('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }
    const message = `Halo Admin Gaia Store, saya mau memesan ${product.title} (${product.price}). Perusahaan: ${companyName}, PIC: ${picName}, WA: ${whatsapp}.`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const konfirmasiHref = `/konfirmasi-pembayaran?produk=${encodeURIComponent(product.title)}&perusahaan=${encodeURIComponent(formData.companyName)}&pic=${encodeURIComponent(formData.picName)}&wa=${encodeURIComponent(formData.whatsapp)}`;

  const handleClose = () => {
    setPaymentLinkClicked(false);
    setFormData({ companyName: '', picName: '', whatsapp: '' });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-50 p-0 overflow-hidden animate-in zoom-in-95 fade-in duration-200">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              Konfirmasi Pesanan
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-white transition-colors p-1 rounded-md hover:bg-muted"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-5">
            {/* Product summary */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <span className="text-xs font-medium text-muted-foreground block mb-1">Item yang dipilih</span>
              <h4 className="font-semibold text-white text-sm leading-tight mb-2">{product.title}</h4>
              <span className="text-primary font-bold">{product.price}</span>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">
                  Nama Perusahaan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="PT. Konstruksi Maju"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">
                  Nama PIC <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.picName}
                  onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Budi Santoso"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">
                  No WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            {/* After payment-link clicked: confirmation prompt */}
            {paymentLinkClicked && hasPaymentLink && (
              <div className="bg-green-950/40 border border-green-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  Sudah bayar? Amankan pesanan Anda.
                </div>
                <a
                  href={konfirmasiHref}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-md px-4 py-2.5 transition-colors"
                >
                  Saya Sudah Bayar — Konfirmasi Sekarang
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2.5 pt-1">
              {/* PRIMARY: Bayar via Payment Link */}
              {hasPaymentLink ? (
                <button
                  type="button"
                  onClick={handlePaymentLink}
                  className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-md px-4 py-3 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                >
                  <CreditCard size={16} />
                  Bayar via Payment Link
                </button>
              ) : (
                <Tooltip.Provider delayDuration={100}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="block w-full">
                        <button
                          type="button"
                          disabled
                          className="flex items-center justify-center gap-2 w-full bg-muted text-muted-foreground text-sm font-bold rounded-md px-4 py-3 cursor-not-allowed opacity-60"
                        >
                          <CreditCard size={16} />
                          Bayar via Payment Link
                        </button>
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-card border border-border text-white text-xs rounded-md px-3 py-1.5 shadow-xl z-[9999]"
                        sideOffset={6}
                      >
                        Segera hadir
                        <Tooltip.Arrow className="fill-border" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}

              {/* SECONDARY: Checkout via WhatsApp */}
              <button
                type="button"
                onClick={handleCheckoutWA}
                className="flex items-center justify-center gap-2 w-full border border-border bg-transparent hover:bg-muted text-white text-sm font-semibold rounded-md px-4 py-2.5 transition-colors"
              >
                <MessageCircle size={16} />
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
