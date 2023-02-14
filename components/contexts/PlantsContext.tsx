import { createContext, useMemo, useState } from "react";
import { IPlant } from "../../models/plants";

interface IPlantsContext {
  plantsList: IPlant[];
  setPlantsList: (value: IPlant[]) => void;
}

export const PlantsContext = createContext<IPlantsContext>({
  plantsList: [],
  setPlantsList: () => [],
});

export const PlantsProvider = ({ children, initialData }) => {
  const [plantsList, setPlantsList] = useState<IPlant[]>(initialData);

  const value = useMemo(() => ({ plantsList, setPlantsList }), [plantsList]);

  return (
    <PlantsContext.Provider value={value}>{children}</PlantsContext.Provider>
  );
};
