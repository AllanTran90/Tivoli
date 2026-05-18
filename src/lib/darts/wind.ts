const directions = [
    "Left",
    "Right",
    "Up",
    "Down",
]

export function getRandomWind(){
    const random =
    Math.floor(
        Math.random()
        * directions.length
    );
    return directions[random];
}