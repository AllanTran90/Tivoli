export function resetDartsRound(
  setScore: React.Dispatch<
    React.SetStateAction<number>
  >,

  setHistory: React.Dispatch<
    React.SetStateAction<string[]>
  >,

  setThrowsLeft: React.Dispatch<
    React.SetStateAction<number>
  >,

  setWind: React.Dispatch<
    React.SetStateAction<string>
  >,

  setClearBoard: React.Dispatch<
    React.SetStateAction<boolean>
  >,



  getRandomWind: () => string
) {


  setScore(0);

  setHistory([]);

  setThrowsLeft(3);

  setWind(getRandomWind());

  setClearBoard(true);

  setTimeout(() => {
    setClearBoard(false);
  }, 0);
}