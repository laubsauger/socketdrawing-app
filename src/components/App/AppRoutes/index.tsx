import React, { Suspense, lazy } from 'react';
import { Outlet, Route, Routes} from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "../../LoadingSpinner";
import Navigation from "../Navigation";

const HomePage = lazy(() => import('../Pages/Home'));
const JoinPage = lazy(() => import('../Pages/Join'));
const AdminPage = lazy(() => import('../Pages/Admin'));
const NotFoundPage = lazy(() => import('../Pages/NotFound'));

const Layout = () => {
  return (
    <div>
      <Navigation />
      <main>
        <Container>
          <Row>
            <Outlet />
          </Row>
        </Container>
      </main>
      {/*<Footer/>*/}
    </div>
  );
};

const LayoutNoNav = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/join" element={<LayoutNoNav />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <JoinPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/" element={<Layout />}>
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
        {/* NOT FOUND */}
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