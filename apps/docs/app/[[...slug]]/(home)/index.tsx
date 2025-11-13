import { Hero } from "./components/hero";

const Home = () => (
  <main className="container mx-auto divide-y border-x px-0">
    <Hero />
    <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="sm:col-span-2">
        {/*<Review />*/}
      </div>
      <div className="sm:col-span-1">
        {/*<OpenSource />*/}
      </div>
    </div>
    {/*<div className="h-8 bg-dashed" />*/}
  </main>
);

export default Home;
