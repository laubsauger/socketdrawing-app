import React, { Suspense, lazy } from 'react';
import { Outlet, Route, Routes} from 'react-router-dom';
import { observer } from "mobx-react-lite";
import LoadingSpinner from "../../LoadingSpinner";
import Navigation from "../navigation";
import {Container, Row} from "react-bootstrap";

const HomePage = lazy(() => import('../pages/Home'));
const AdminPage = lazy(() => import('../pages/Admin'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const Layout = () => {
  return (
    <div>
      <Navigation />
      <hr />

      {/*<div style={{minHeight: '600px'}}>*/}
      {/*  <main style={{ minHeight: "100vh" }}>*/}
        <main>
          <Container>
            {/*<div className="my-5">*/}
              <Row>
                {/*<div className="col-md-10 offset-md-1 col-lg-10 offset-lg-1">*/}
                  <Outlet />
                {/*</div>*/}
              </Row>
            {/*</div>*/}
          </Container>
        </main>
        {/*<Footer/>*/}
      {/*</div>*/}

    </div>
  );
}

const AppRoutes = () => {
  return (
      <Routes>
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