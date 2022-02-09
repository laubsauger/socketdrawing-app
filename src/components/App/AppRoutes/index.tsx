import React, { Suspense, lazy } from 'react';
import { Route, Routes} from 'react-router-dom';
import { observer } from "mobx-react-lite";
import LoadingSpinner from "../../LoadingSpinner";
import DefaultLayout from "../Layouts/Default";
import NoNavLayout from "../Layouts/NoNav";

const HomePage = lazy(() => import('../Pages/Home'));
const JoinPage = lazy(() => import('../Pages/Join'));
const AdminPage = lazy(() => import('../Pages/Admin'));
const NotFoundPage = lazy(() => import('../Pages/NotFound'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/join" element={<NoNavLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <JoinPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/" element={<DefaultLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="config"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPage />
            </Suspense>
          }
        />
        {/* NOT FOUND catch all */}
        <Route
          path='*'
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
};

export default observer(AppRoutes);