import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  ProtectedRoute,
  SessionTimeoutGuard,
} from '@/features/auth/components';
import { ConsentBanner } from '@/features/privacy/ConsentBanner';
import { FormSecurityBoundary } from '@/features/security/FormSecurityBoundary';
import { Skeleton } from '@/components/ui';

// Route-level chunks keep the first dashboard paint fast while each feature remains isolated.
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
const RecommendationsPage = lazy(() =>
  import('@/features/recommendations/RecommendationsPage').then((module) => ({
    default: module.RecommendationsPage,
  })),
);
const MarketplacePage = lazy(() =>
  import('@/features/marketplace/MarketplacePage').then((module) => ({
    default: module.MarketplacePage,
  })),
);
const MarketplaceProductPage = lazy(() =>
  import('@/features/marketplace/MarketplaceProductPage').then((module) => ({
    default: module.MarketplaceProductPage,
  })),
);
const PlantDoctorPage = lazy(() =>
  import('@/features/plant-doctor/PlantDoctorPage').then((module) => ({
    default: module.PlantDoctorPage,
  })),
);
const GreenMindAssistantPage = lazy(() =>
  import('@/features/assistant/GreenMindAssistantPage').then((module) => ({
    default: module.GreenMindAssistantPage,
  })),
);
const IntelligenceHubPage = lazy(() =>
  import('@/features/intelligence-hub/IntelligenceHubPage').then((module) => ({
    default: module.IntelligenceHubPage,
  })),
);
const PlantDetailsPage = lazy(() =>
  import('@/features/plant-library/PlantDetailsPage').then((module) => ({
    default: module.PlantDetailsPage,
  })),
);
const PlantLibraryPage = lazy(() =>
  import('@/features/plant-library/PlantLibraryPage').then((module) => ({
    default: module.PlantLibraryPage,
  })),
);
const GardenDiaryPage = lazy(() =>
  import('@/features/garden-diary/GardenDiaryPage').then((module) => ({
    default: module.GardenDiaryPage,
  })),
);
const DiaryPlantProfilePage = lazy(() =>
  import('@/features/garden-diary/DiaryPlantProfilePage').then((module) => ({
    default: module.DiaryPlantProfilePage,
  })),
);
const TasksPage = lazy(() =>
  import('@/features/workspace/WorkspacePages').then((module) => ({
    default: module.TasksPage,
  })),
);
const AnalyticsPage = lazy(() =>
  import('@/features/workspace/WorkspacePages').then((module) => ({
    default: module.AnalyticsPage,
  })),
);
const SettingsPage = lazy(() =>
  import('@/features/workspace/WorkspacePages').then((module) => ({
    default: module.SettingsPage,
  })),
);
const HelpCenterPage = lazy(() =>
  import('@/features/workspace/WorkspacePages').then((module) => ({
    default: module.HelpCenterPage,
  })),
);
const ProfilePage = lazy(() =>
  import('@/features/workspace/WorkspacePages').then((module) => ({
    default: module.ProfilePage,
  })),
);
const SecuritySettingsPage = lazy(() =>
  import('@/features/security/SecuritySettingsPage').then((module) => ({
    default: module.SecuritySettingsPage,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/features/privacy/LegalPages').then((module) => ({
    default: module.PrivacyPolicyPage,
  })),
);
const TermsPage = lazy(() =>
  import('@/features/privacy/LegalPages').then((module) => ({
    default: module.TermsPage,
  })),
);
const CookiePolicyPage = lazy(() =>
  import('@/features/privacy/LegalPages').then((module) => ({
    default: module.CookiePolicyPage,
  })),
);
const ForbiddenPage = lazy(() =>
  import('@/features/errors/SecureErrorPages').then((module) => ({
    default: module.ForbiddenPage,
  })),
);
const RateLimitedPage = lazy(() =>
  import('@/features/errors/SecureErrorPages').then((module) => ({
    default: module.RateLimitedPage,
  })),
);
const ServerErrorPage = lazy(() =>
  import('@/features/errors/SecureErrorPages').then((module) => ({
    default: module.ServerErrorPage,
  })),
);
const OfflinePage = lazy(() =>
  import('@/features/errors/SecureErrorPages').then((module) => ({
    default: module.OfflinePage,
  })),
);
const NetworkErrorPage = lazy(() =>
  import('@/features/errors/SecureErrorPages').then((module) => ({
    default: module.NetworkErrorPage,
  })),
);
const EmailVerificationSuccessPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.EmailVerificationSuccessPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.NotFoundPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const SignInPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.SignInPage,
  })),
);
const SignUpPage = lazy(() =>
  import('@/features/auth/pages').then((module) => ({
    default: module.SignUpPage,
  })),
);

function RouteLoader() {
  return (
    <div
      className="mx-auto grid min-h-[42vh] w-full max-w-[1536px] place-items-center px-5 sm:px-8 lg:px-10"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-5xl rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between gap-5">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-56" />
          </div>
          <Skeleton className="size-11 rounded-[16px]" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-28" />
          ))}
        </div>
        <span className="sr-only">Loading workspace</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <FormSecurityBoundary>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <SessionTimeoutGuard>
                  <DashboardLayout />
                </SessionTimeoutGuard>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/recommendations"
                element={<RecommendationsPage />}
              />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route
                path="/marketplace/product/:id"
                element={<MarketplaceProductPage />}
              />
              <Route path="/plant-doctor" element={<PlantDoctorPage />} />
              <Route path="/assistant" element={<GreenMindAssistantPage />} />
              <Route
                path="/intelligence-hub"
                element={<IntelligenceHubPage />}
              />
              <Route path="/plant-library" element={<PlantLibraryPage />} />
              <Route path="/plant-library/:id" element={<PlantDetailsPage />} />
              <Route path="/garden-diary" element={<GardenDiaryPage />} />
              <Route
                path="/garden-diary/:id"
                element={<DiaryPlantProfilePage />}
              />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route
                path="/settings/security"
                element={<SecuritySettingsPage />}
              />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/verify-email"
            element={<EmailVerificationSuccessPage />}
          />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/rate-limited" element={<RateLimitedPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/network-error" element={<NetworkErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </FormSecurityBoundary>
      <ConsentBanner />
    </Suspense>
  );
}
