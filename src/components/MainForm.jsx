import { useState, useEffect } from "react";
import useAxios from "axios-hooks";

import ComboBox from "./ComboBox";
import ComboBoxCategory from "./ComboboxCategory";
import ComboBoxProviders from "./ComboboxProviders";
import ComboBoxGroup from "./ComboBoxGroup";
import Spinner from "./Spinner";
// import ProgressBar from './ProgressBar'

const endPoint =
  "https://script.google.com/macros/s/AKfycbxQvcen9VHd-lysj7SjmT5Vj5PWqUUMmP2n--SCgOIXc57YKvR7mdR9KioNNqnIetyk/exec";

export default function MainForm() {
  const [selectedDriver, setSelectedDriver] = useState({});
  const [date, setDate] = useState(null);
  const [truckNumber, setTruckNumber] = useState("");
  const [trailerNumber, setTrailerNumber] = useState("");
  const [selectedState, setSelectedState] = useState({});
  const [city, setCity] = useState("");
  const [selectedProvider, setSelectedProvider] = useState({});
  const [repairNeeded, setRepairNeeded] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [repairCategory, setRepairCategory] = useState("");
  const [total, setTotal] = useState("");
  const [warning, setWarning] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedUser, setUser] = useState({});

  const [{ data, loading, error }] = useAxios(endPoint);
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: endPoint + "?route=createIncident",
      method: "POST",
    },
    { manual: true }
  );

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };
  function handleProviderChange(provider) {
    setSelectedProvider(provider);
}

  const handleSubCategoryChange = (newSubCategory) => {
    setSelectedSubCategory(newSubCategory);
  };

  useEffect(() => {
    console.log("Valor actual de repairCategory:", repairCategory);
  }, [repairCategory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedDriver ||
      !selectedState ||
      !selectedProvider ||
      !selectedUser
    ) {
      return setWarning(true);
    }

    const body = {
      date,
      driverName: selectedDriver.name,
      truckNumber,
      trailerNumber,
      stateName: selectedState.name,
      city,
      providerName: selectedProvider,
      repairNeeded,
      repairCategory: selectedCategory,
      repairSubCategory: selectedSubCategory,
      total,
      user: selectedUser.name,
    };

    console.log(body);
    const response = await executePost({
      data: JSON.stringify(body),
    });
    if (response) {
      setSelectedDriver({});
      setDate(null);
      setTruckNumber("");
      setTrailerNumber("");
      setSelectedState({});
      setCity("");
      setSelectedProvider({});
      setRepairNeeded("");
      setRepairCategory("");
      setTotal("");
      setUser({});
      setSelectedDriver({});
      setSelectedProvider({});
      setSelectedState({});
      setSuccessMessage(true);
      setWarning(false);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 4000);
    }
  }

  const handleTotal = (e) => {
    let value = e.target.value;
    if (value && !value.startsWith("$")) {
      value = "$" + value;
    }
    setTotal(value);
  };

  if (error || postError)
    return <h2 className="text-lg text-center p-4">Error</h2>;
  if (loading || postLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <ComboBox
          title="* Driver Name"
          items={data.drivers.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedDriver}
          setSelectedPerson={setSelectedDriver}
        />

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Truck #
          </label>
          <input
            type="text"
            placeholder="Truck #"
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Trailer #
          </label>
          <input
            type="text"
            placeholder="Trailer #"
            value={trailerNumber}
            onChange={(e) => setTrailerNumber(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <ComboBox
          title="* State"
          items={data.states.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedState}
          setSelectedPerson={setSelectedState}
        />

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            City
          </label>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <ComboBoxProviders
          title="* Service Providers"
          items={data.providers}
          onCategoryChange={handleProviderChange}
        />

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Repair Needed
          </label>
          <input
            type="text"
            placeholder="Repair Needed"
            value={repairNeeded}
            onChange={(e) => setRepairNeeded(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <ComboBoxCategory
            title="Repair Category"
            items={data.categories}
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Total
          </label>
          <input
            type="text"
            placeholder="$Total"
            value={total}
            onChange={handleTotal}
            className="p-2 rounded border shadow-sm"
          />
          <ComboBox
            title="* Sumbitted By"
            items={data.users.map((name, i) => ({ id: i, name }))}
            selectedPerson={selectedUser}
            setSelectedPerson={setUser}
          />
        </div>
      </div>

      {warning && (
        <p className="text-sm text-red-600 mt-4 mb-4" id="email-error">
          Complete the required fields *
        </p>
      )}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 my-4" id="message">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully uploaded
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <ProgressBar progress={percentage} /> */}
      <button
        type="submit"
        className={`${
          !warning && "mt-4"
        } rounded-md bg-emerald-700 px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
      >
        Submit
      </button>
    </form>
  );
}
