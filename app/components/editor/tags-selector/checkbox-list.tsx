import React from "react";
import { CheckboxState } from "./tree";
import {Box, Checkbox, Stack} from "@chakra-ui/react";
import type Tag from "~/types/Tag";

type CheckboxListProps = {
    items: Tag[];
    idsToRender?: number[];
    indentLevel?: number;
    onClick?: (id: number) => void;
    getStateForId: (id: number) => CheckboxState | undefined;
};

const CheckboxList: React.FC<CheckboxListProps> = ({
                                                       items,
                                                       getStateForId,
                                                       idsToRender = [],
                                                       indentLevel = 0,
                                                       onClick = () => {},
                                                   }) => {
    if (!idsToRender.length) {
        idsToRender = items.filter((i) => !i.parent?.id).map((i) => i.id);
    }

    const getChildNodes = (parentId: number) => {
        const nodeItems = items.filter((i) => i.parent?.id === parentId);
        if (!nodeItems.length) return null;
        return (
            <Box pl={4}>
                <CheckboxList
                    items={items}
                    idsToRender={nodeItems.map((i) => i.id)}
                    indentLevel={indentLevel + 1}
                    onClick={onClick}
                    getStateForId={getStateForId}
                />
            </Box>
        );
    };

    return (
        <Stack direction={'column'} spacing={1}>
            {idsToRender.map((id) => {
                const idx = items.findIndex((i) => i.id === id);
                if (idx != -1) {
                    const item = items[idx];
                    const checkboxState = getStateForId(id);
                    return (
                        <React.Fragment key={item.id}>
                            <Checkbox
                                colorScheme={item.color}
                                onChange={() => onClick(item.id)}
                                isChecked={checkboxState === CheckboxState.CHECKED}
                            >
                                {item.title}
                            </Checkbox>
                            {getChildNodes(item.id)}
                        </React.Fragment>
                    );
                } else {
                    return null;
                }
            })}
        </Stack>
    );
};

export default CheckboxList;
