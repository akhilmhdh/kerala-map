import React, { useEffect, useState } from "react";
import { Activity, ChevronDown, Moon, Sun } from "react-feather";
import { hot } from "react-hot-loader";
import MapBox from "./components/MapBox";
import { getGeoJSONs, getKeralaStats } from "./requests";

function App() {
  const [dark, setdark] = useState(true);
  const [stats, setStats] = useState({
    latest: {},
    summary: {},
    lastUpdated: "",
  });
  const [zones, setZones] = useState({ hotspots: [] });
  const [fetched, setFetched] = useState(false);
  const [geoJSONs, setGeoJSONs] = useState({ lsgd: null, district: null });

  useEffect(() => {
    if (!fetched) {
      (async () => {
        try {
          let {
            latest,
            summary,
            hotspots,
            lastUpdated,
          } = await getKeralaStats();
          let { lsgd, district } = await getGeoJSONs();
          setGeoJSONs({ lsgd: lsgd, district: district });
          setZones({ hotspots: hotspots });
          setStats({
            latest: latest,
            summary: summary,
            lastUpdated: lastUpdated,
          });
          setFetched(true);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [fetched]);

  return fetched ? (
    <div
      className={`flex relative min-h-screen min-w-screen overflow-x-hidden antialiased font-inter ${
        dark ? "bg-dark-500" : "bg-light-500"
      }`}
    >
      <div
        className={`flex flex-col fixed top-0 right-0 z-40 m-2 items-end uppercase fill-current ${
          dark ? "text-white" : "text-black"
        }`}
      >
        <div className="text-xl font-extrabold leading-none tracking-wider text-right select-none lg:text-3xl">
          KERALA
        </div>
        <div className="flex flex-row items-end object-center select-none text-mobiles lg:text-mobile">
          <p className="flex leading-none">Part of</p>
          <a className="flex w-12 ml-1 lg:" href="https://coronasafe.network/">
            <img
              src={require("./assets/img/coronaSafeLogo.svg")}
              title="CoronaSafe: Corona Literacy Mission"
              alt="CoronaSafe Logo: Corona Literacy Mission"
            />
          </a>
        </div>
        <div className="flex group text-mobiles">
          <div className="flex flex-col items-end mt-1 space-y-1 transition duration-150 ease-in-out origin-right transform scale-0 lg:w-full group-hover:scale-100">
            <a href="/">
              <div className="flex flex-row items-center cursor-pointer">
                Map
                <Activity className="flex ml-1" size={"0.8rem"} />
              </div>
            </a>
            <a href="https://keralamap.coronasafe.network/">
              <div className="flex flex-row items-center cursor-pointer">
                Dashboard
                <Activity className="flex ml-1" size={"0.8rem"} />
              </div>
            </a>
            {dark ? (
              <div
                className="flex flex-row items-center cursor-pointer"
                onClick={() => setdark(!dark)}
              >
                Light
                <Sun className="flex ml-1" size={"0.8rem"} />
              </div>
            ) : (
              <div
                className="flex flex-row items-center cursor-pointer"
                onClick={() => setdark(!dark)}
              >
                Dark
                <Moon className="flex ml-1" size={"0.8rem"} />
              </div>
            )}
          </div>
          <ChevronDown
            size={"0.8rem"}
            className="absolute right-0 transition duration-150 ease-in-out transform cursor-pointer group-hover:scale-0"
          />
        </div>
      </div>
      <MapBox stats={stats} zones={zones} dark={dark} geoJSONs={geoJSONs} />
    </div>
  ) : (
    <div
      className={`flex h-screen w-screen items-center justify-center overflow-hidden ${
        dark ? "bg-dark-500" : "bg-light-500"
      }`}
    >
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default hot(module)(App);
