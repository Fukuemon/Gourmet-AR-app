import Layout from "src/components/layouts/Layout";
import MyComponent from "../features/Map/components/GoogleMap";

export default function MapView() {
  return (
    <div>
      <Layout title="Map View">
        <MyComponent />
      </Layout>
    </div>
  );
}
