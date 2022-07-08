import type {ItemState} from "./tree";
import {CheckboxState} from "./tree";
import type Tag from "~/types/Tag";

export const updateItemStates = (oldState: ItemState[], items: Tag[], clickedId: number) => {
    const newState = oldState.map((i) => ({...i}));

    const getItemState = (id: number) => {
        const idx = newState.findIndex((i) => i.id === id);
        return idx !== -1 ? newState[idx].state : null;
    };

    const updateParent = (id: number) => {
        const item = items.find((i) => i.id === id);
        const parent = items.find((i) => i.id === item?.parent?.id);
        if (!parent) return;
        const childIds = items.filter((i) => i.parent?.id === parent.id).map((i) => i.id);
        const childStates = childIds.map((childId) => getItemState(childId));

        const idx = newState.findIndex((i) => i.id === parent.id);
        if (idx !== -1 && childStates.findIndex(s => s === CheckboxState.CHECKED) !== -1) {
            newState[idx].state = CheckboxState.CHECKED;
        }
        updateParent(parent.id);
    };
    const setUnchecked = (id: number) => {
        const idx = newState.findIndex((i) => i.id === id);
        if (idx != -1) {
            items
                .filter((i) => i.parent?.id === id)
                .map((i) => i.id)
                .forEach((childId) => setUnchecked(childId));
            newState[idx].state = CheckboxState.UNCHECKED;
        }
        updateParent(id);
    };
    const setChecked = (id: number) => {
        const idx = newState.findIndex((i) => i.id === id);
        if (idx !== -1) {
            newState[idx].state = CheckboxState.CHECKED;
        }
        updateParent(id);
    };
    // actual logic
    const itemState = getItemState(clickedId);
    if (itemState === CheckboxState.CHECKED) {
        setUnchecked(clickedId);
    } else {
        setChecked(clickedId);
    }
    return newState;
};
