import {useState} from "react";

const useGameController= () => {
    // let selectedTile: number[] = [];
 const [selectedTile, setSelectedTile] = useState<number[]>([]);
    const onPressNumberTile = (value:number) => {
        if(selectedTile.find((v) => v === value)) {
          setSelectedTile(selectedTile.filter((v) => v !== value))
        } else {
          setSelectedTile([...selectedTile, value]);
        }
        // selectedTile.push(value);
    }

    const isTileSelected = (value:number) => {
        console.log("isTileSelected", selectedTile, value)
        return selectedTile.includes(value)
    }
    return {
        onPressNumberTile,
        isTileSelected
    }
}

export default useGameController;
