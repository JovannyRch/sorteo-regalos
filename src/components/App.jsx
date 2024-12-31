import { useEffect, useState } from "react";
import AnimatedDraw from "./AnimatedDraw";
import Results from "./Results";

const getRandomItemOfArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const removeItemOfArray = (array, item) => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

const randomizeArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const getDifferenceArray = (array1, array2) => {
  return array1.filter((x) => !array2.includes(x));
};

const formatFileName = (title) => {
  return title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

/* 

  users={["Sebastian", "Arturo", "Santi", "Sofi 4", "Andrea", "Karla"]}
*/

const initialUsers = [
  "Artemio",
  "Alicia",
  "Abraham",
  "Arturito",
  "Fide",
  "Elizabeth",
  "Andrea Chimal Márquez",
  "Sofía Chimal Márquez",
  "Guille",
  "Andrea Rch",
  "Daniela",
  "Marco",
  "Mariela",
  "Sofí Chimal Contreras",
  "Sofí de la Rosa",
  "Santi",
  "Sebas",
  "Bryan",
  "Juan",
];

const App = ({ title = "Sorteo familiar" }) => {
  const [users, setUsers] = useState(initialUsers);
  const [inputUsers, setInputUsers] = useState(() => {
    return initialUsers.join(", ");
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [availableUsers, setAvailableUsers] = useState(users);
  const [usersToBeSelected, setUsersToBeSelected] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [results, setResults] = useState([]);

  const reset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setAvailableUsers(users);
    setResults([]);
  };

  const onInit = () => {
    console.log("availableUsers", availableUsers);
    const currentUser = getRandomItemOfArray(availableUsers);
    setCurrentUser(currentUser);
    setIsPlaying(true);
  };

  const downloadResults = () => {
    const csv =
      "De,A\n" +
      results.map((result) => `${result.from},${result.to}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", formatFileName(`Resultados-${title}.csv`));
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSelected = (selectedParticipant) => {
    setResults((prevResults) => [
      ...prevResults,
      {
        from: currentUser,
        to: selectedParticipant,
      },
    ]);

    setTimeout(() => {
      const resultsTable = document.getElementById("results-table");
      resultsTable.scrollTop = resultsTable.scrollHeight;
    }, 0);
  };

  useEffect(() => {
    const usersArray = results.map((result) => result.to);
    const availableUsers = users.filter((user) => !usersArray.includes(user));
    setAvailableUsers(randomizeArray(availableUsers));
    const usersWithResult = results.map((result) => result.from);
    const usersWithoutResult = getDifferenceArray(users, usersWithResult);
    setCurrentUser(getRandomItemOfArray(usersWithoutResult));
  }, [results]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    setUsersToBeSelected(removeItemOfArray(availableUsers, currentUser));
  }, [availableUsers, currentUser, isPlaying]);

  useEffect(() => {
    if (usersToBeSelected.length === 1) {
      setResults((prevResults) => [
        {
          from: currentUser,
          to: usersToBeSelected[0],
        },
        ...prevResults,
      ]);
      setIsPlaying(false);
      setIsFinished(true);
    }
    if (usersToBeSelected.length === 0 && results.length) {
      setIsPlaying(false);
      setIsFinished(true);
    }
  }, [usersToBeSelected]);

  const renderBody = () => {
    if (isPlaying && !isFinished) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center">
          <Results results={results} />
          <hr />
          <div className="font-bold">{currentUser}</div>

          <div className="w-screen text-center">
            <AnimatedDraw
              participants={usersToBeSelected}
              onSelected={onSelected}
            />
          </div>
        </div>
      );
    }

    if (isFinished) {
      return (
        <>
          <h1 className="text-center text-lg font-bold mb-4">{title}</h1>
          <Results results={results} />
          {results.length !== users.length ? (
            <>
              {/* Show error on sorteo, an user has no result */}
              <div className="text-red-500 mt-2 text-center">
                Algo salió mal, por favor repita el sorteo. Un participante no
                tiene regalo.
              </div>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={reset}
              >
                Repetir Sorteo
              </button>
            </>
          ) : (
            <div class="flex flex-col gap-4">
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={downloadResults}
              >
                Descargar resultados
              </button>

              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={reset}
              >
                Repetir Sorteo
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <h1 className="text-center text-lg font-bold">{title}</h1>
        <div className="w-full mt-4">
          <div className="flex justify-center">
            <textarea
              className="w-1/2 h-64 p-2 rounded border-2 border-gray-300 focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ingrese los participantes separados por coma"
              onChange={(e) => {
                setInputUsers(e.target.value);
                const users = e.target.value.split(",");
                setUsers(users.map((user) => user.trim()));
                setAvailableUsers(users);
              }}
              value={inputUsers}
            />
          </div>
        </div>

        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setTimeout(() => {
              onInit();
            }, 0);
          }}
        >
          Iniciar Sorteo
        </button>
      </>
    );
  };

  useEffect(() => {
    console.log("isPlaying", isPlaying);
  }, [isPlaying]);

  return (
    <div className="App">
      <div className="bg-dark-blue text-white p-4 h-screen w-screen flex flex-col justify-center items-center">
        {renderBody()}
      </div>
    </div>
  );
};

export default App;
