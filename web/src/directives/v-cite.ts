// src/directives/v-cite.ts
import { type DirectiveBinding, h, render, type VNode } from "vue";
import CiteTag from "../components/CiteTag.vue";

type MountedCite = { placeholder: HTMLElement; vnode: VNode };

const mountedMap = new WeakMap<HTMLElement, MountedCite[]>();
const observerMap = new WeakMap<HTMLElement, MutationObserver>();
const rafMap = new WeakMap<HTMLElement, number>();

function mountCites(rootEl: HTMLElement, appContext: any) {
    const cites = Array.from(rootEl.querySelectorAll("cite"));
    const mounted: MountedCite[] = mountedMap.get(rootEl) ?? [];

    for (const el of cites) {
        const rawId = (el.getAttribute("data-id") || el.textContent || "")
            .trim();
        if (!rawId) continue;

        const placeholder = document.createElement("span");
        placeholder.className = "cite-placeholder";

        el.replaceWith(placeholder);

        const vnode = h(CiteTag, { snippet_id: rawId });
        (vnode as any).appContext = appContext;
        render(vnode, placeholder);

        mounted.push({ placeholder, vnode });
    }

    mountedMap.set(rootEl, mounted);
}

function unmountCites(rootEl: HTMLElement) {
    const mounted = mountedMap.get(rootEl) || [];
    for (const m of mounted) render(null, m.placeholder); 
    mountedMap.set(rootEl, []);
}

function scheduleRemount(rootEl: HTMLElement, appContext: any) {
    const prev = rafMap.get(rootEl);
    if (prev) cancelAnimationFrame(prev);
    const id = requestAnimationFrame(() => {
        unmountCites(rootEl);
        mountCites(rootEl, appContext);
    });
    rafMap.set(rootEl, id);
}

export const vCite = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // console.log('v-cite mounted');
        const appContext = (binding.instance as any)?.appContext;
        mountCites(el, appContext);

        const obs = new MutationObserver(() => scheduleRemount(el, appContext));
        obs.observe(el, { childList: true, subtree: true });
        observerMap.set(el, obs);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        // console.log('v-cite updated');
        // const appContext = (binding.instance as any)?.appContext;
        // unmountCites(el);
        // mountCites(el, appContext);
        el;
        binding;
    },
    unmounted(el: HTMLElement) {
        console.log('v-cite unmounted');
        const obs = observerMap.get(el);
        if (obs) obs.disconnect();
        observerMap.delete(el);
        const raf = rafMap.get(el);
        if (raf) cancelAnimationFrame(raf);
        rafMap.delete(el);
        unmountCites(el);
    },
};
