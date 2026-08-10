import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/Home';
import KonfirmasiPembayaran from '@/pages/KonfirmasiPembayaran';
import AdminPesanan from '@/pages/AdminPesanan';
import CatalogProduk from '@/pages/CatalogProduk';
import Solusi from '@/pages/Solusi';
import PaketDetail from '@/pages/PaketDetail';
import AdminKatalog from '@/pages/AdminKatalog';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* ── Existing routes — NOT modified ── */}
      <Route path="/" component={HomePage} />
      <Route path="/konfirmasi-pembayaran" component={KonfirmasiPembayaran} />
      <Route path="/admin-pesanan" component={AdminPesanan} />

      {/* ── Phase 2B: Gustafta Catalog routes ── */}
      <Route path="/produk" component={CatalogProduk} />
      <Route path="/solusi" component={Solusi} />
      <Route path="/paket/:id" component={PaketDetail} />
      <Route path="/admin-katalog" component={AdminKatalog} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
