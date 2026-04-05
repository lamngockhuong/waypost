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
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <div class="flex min-h-dvh bg-background font-sans text-foreground">
        <Sidebar />
        <div class="flex flex-1 flex-col lg:ml-60">
          <MobileNav />
          <main class="flex-1 overflow-x-hidden" id="main-content">
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
