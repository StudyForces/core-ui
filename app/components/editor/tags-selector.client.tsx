import Tree from "~/components/editor/tags-selector/tree";
import type Tag from "~/types/Tag";

export default function TagsSelector({
                                         tags,
                                         selected,
                                         onChange
                                     }: { tags: Tag[], selected: Tag[], onChange: (tags: Tag[]) => void }) {
    return <Tree selected={selected} tags={tags} onChange={onChange}></Tree>;
}
