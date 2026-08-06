import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { X, ShoppingBag, CreditCard, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { ADMIN_WA_NUMBER } from '@/lib/config';
import { Product } from '@/pages/Home';

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    picName: '',
    whatsapp: ''
  });

  if (!product) return null;

  const handleCheckoutWA = (e: React.FormEvent) => {
    e.preventDefault();
    const { companyName, picName, whatsapp } = formData;
    
    if (!companyName || !picName || !whatsapp) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }
    
    const message = `Halo Admin Gaia Store, saya mau memesan ${product.title} (${product.price}). Perusahaan: ${companyName}, PIC: ${picName}, WA: ${whatsapp}.`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-50 p-0 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              Konfirmasi Pesanan
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-white transition-colors p-1 rounded-md hover:bg-muted">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6">
            <div className="bg-background rounded-lg p-4 border border-border mb-6">
              <span className="text-xs font-medium text-muted-foreground block mb-1">Item yang dipilih</span>
              <h4 className="font-semibold text-white text-sm leading-tight mb-2">{product.title}</h4>
              <div className="flex justify-between items-end mt-2">
                <span className="text-primary font-bold">{product.price}</span>
              </div>
            </div>

            <form id="checkout-form" onSubmit={handleCheckoutWA} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">Nama Perusahaan <span className="text-destructive">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="PT. Konstruksi Maju"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">Nama PIC <span className="text-destructive">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.picName}
                  onChange={(e) => setFormData({...formData, picName: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Budi Santoso"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white block">No WhatsApp <span className="text-destructive">*</span></label>
                <input 
                  type="tel" 
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-border bg-background/50 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">Total Pembayaran</span>
              <span className="text-lg font-bold text-white">{product.price}</span>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Checkout via WhatsApp
            </button>

            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button 
                    disabled
                    className="w-full bg-transparent border border-border text-muted-foreground font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    Bayar via Payment Link
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content 
                    sideOffset={5} 
                    className="bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded shadow-lg border border-border animate-in fade-in zoom-in-95"
                  >
                    Segera hadir
                    <Tooltip.Arrow className="fill-border" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
