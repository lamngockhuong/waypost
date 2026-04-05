import { Router, Route, Switch } from "wouter"
import { Sidebar } from "./components/layout/sidebar"
import { MobileNav } from "./components/layout/mobile-nav"
import { ToastContainer } from "./components/ui/toast"
import { DomainsPage } from "./pages/domains"
import { DomainDetailPage } from "./pages/domain-detail"
import { NotFoundPage } from "./pages/not-found"

export function App() {
  return (
    <Router base="/admin">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <div class="flex min-h-dvh bg-slate-50 font-sans text-slate-800">
        <Sidebar />
        <MobileNav />
        <div class="flex flex-1 flex-col md:ml-16 lg:ml-60">
          <main class="flex-1 p-4 md:p-6" id="main-content">
            <Switch>
              <Route path="/" component={DomainsPage} />
              <Route path="/domains/:domain" component={DomainDetailPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </main>
        </div>
      </div>
      <ToastContainer />
    </Router>
  )
}
