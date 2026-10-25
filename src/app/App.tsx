import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { HomePage } from "../pages/HomePage";
import { LearningPage } from "../pages/LearningPage";
import { LabPage } from "../pages/LabPage";
import { NotFoundPage } from "../pages/NotFoundPage";
const UnitPage = lazy(() =>
  import("../pages/academic/UnitPage").then((module) => ({
    default: module.UnitPage,
  })),
);
const TopicPage = lazy(() =>
  import("../pages/academic/TopicPage").then((module) => ({
    default: module.TopicPage,
  })),
);
const GuidePage = lazy(() =>
  import("../pages/academic/GuidePage").then((module) => ({
    default: module.GuidePage,
  })),
);
const ReferencesPage = lazy(() =>
  import("../pages/academic/ReferencesPage").then((module) => ({
    default: module.ReferencesPage,
  })),
);
const EditorialPage = lazy(() =>
  import("../pages/academic/EditorialPage").then((module) => ({
    default: module.EditorialPage,
  })),
);
import { learning } from "../data/learning";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="ecuador-megadiverso" element={<UnitPage unitId="2" />} />
        <Route
          path="areas-protegidas"
          element={<LearningPage content={learning.areas} />}
        />
        <Route path="conservacion" element={<UnitPage unitId="3" />} />
        <Route
          path="ecuador-megadiverso/tema/:topicId"
          element={<TopicPage />}
        />
        <Route path="conservacion/tema/:topicId" element={<TopicPage />} />
        <Route path="laboratorio-sig/guias/:guideId" element={<GuidePage />} />
        <Route path="referencias" element={<ReferencesPage />} />
        <Route path="referencias/:referenceId" element={<ReferencesPage />} />
        <Route path="revision-editorial" element={<EditorialPage />} />
        <Route path="laboratorio-sig" element={<LabPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
