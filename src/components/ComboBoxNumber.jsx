import { useState } from "react";
import PropTypes from "prop-types";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

const peopleMock = [
  { id: 1, name: "Leslie Alexander" },
  // More users...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComboBoxNumber({
  items = peopleMock,
  title,
  selectedPerson,
  setSelectedPerson,
  isInvalid = false,
}) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? items
      : items.filter((person) => {
          return String(person.name).includes(query);
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
      className="mb-4"
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        {title}
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className={`w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm sm:text-sm sm:leading-6 ${
            isInvalid ? "border-red-500" : "border-gray-300"
          }`}
          onChange={(event) => {
            const newQuery = event.target.value;
            setQuery(newQuery);

            if (newQuery === "") {
              setSelectedPerson(null); // Aquí reseteas selectedPerson
            }
          }}
          displayValue={(person) => (person?.name ? String(person.name) : "")}
          onBlur={(e) => {
            if (
              !e.relatedTarget ||
              !e.relatedTarget.classList.contains("optionclass")
            ) {
              setQuery("");
            }
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 optionclass", // Agrega tu clase aquí
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {person.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

ComboBoxNumber.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  selectedPerson: PropTypes.object,
  setSelectedPerson: PropTypes.func,
};
