import { useCallback, useState } from "react";
import { updateItemStates } from "./updateItemStates";
import type Tag from "~/types/Tag";
import CheckboxList from "~/components/editor/tags-selector/checkbox-list";

export enum CheckboxState {
    UNCHECKED,
    CHECKED,
}

export type ItemState = {
    id: number;
    state: CheckboxState;
};

const Tree = ({selected, tags, onChange}: {selected: Tag[], tags: Tag[], onChange: (selected: Tag[]) => void}) => {
    const [itemStates, setItemStates] = useState<ItemState[]>(tags.map(t => ({
        id: t.id,
        state: selected.findIndex(i => t.id === i.id) !== -1 ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
    })));
    const getStateForId = useCallback(
        (id: number) => {
            return itemStates.find((i) => i.id === id)?.state;
        },
        [itemStates]
    );
    const clickHandler = useCallback((id) => {
        const state = updateItemStates(itemStates, tags, id);
        setItemStates(state);
        const newTags: Tag[] = state.filter(s => s.state === CheckboxState.CHECKED)
            .map(i => {
                const idx = tags.findIndex(t => i.id === t.id);
                return idx !== -1 ? tags[idx] : null;
            })
            .filter(t => t !== null)
            .map(t => t as Tag);
        onChange(newTags);
    }, [itemStates]);
    return <CheckboxList items={tags} onClick={clickHandler} getStateForId={getStateForId} />;
};

export default Tree;
