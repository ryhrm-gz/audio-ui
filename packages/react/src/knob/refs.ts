import { useCallback, type Ref } from "react";

export function useComposedRefs<TElement>(...refs: Array<Ref<TElement> | undefined>) {
  return useCallback((node: TElement | null) => {
    for (const ref of refs) {
      assignRef(ref, node);
    }
  }, refs);
}

function assignRef<TElement>(ref: Ref<TElement> | undefined, node: TElement | null) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref !== null && ref !== undefined) {
    ref.current = node;
  }
}
