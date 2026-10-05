import type { MaybeRefOrGetter } from 'vue';

export const useFrameEmbed = (url: MaybeRefOrGetter<string>) => {
  const target = computed(() => toValue(url));
  const { data } = useFetch<{ embeddable: boolean }>('/api/frame-check', {
    query: computed(() => ({ url: target.value })),
    watch: [target],
    default: () => ({ embeddable: false })
  });

  const embeddable = computed(() => data.value?.embeddable === true);

  return { embeddable };
};
