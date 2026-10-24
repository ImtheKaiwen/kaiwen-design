import manifestData from './component-manifest.generated.json';

export interface ComponentManifestProp {
  name: string;
  required: boolean;
  type: string;
  description: string;
}

export interface ComponentManifestStory {
  name: string;
  exportName: string;
  reference: string;
}

export interface ComponentManifestEntry {
  name: string;
  package: string;
  importPath: string;
  exportName: string;
  status: string;
  platform: string;
  category: string;
  props: ComponentManifestProp[];
  states: string[];
  tokens: string[];
  stories: ComponentManifestStory[];
  propsReference: string;
  storyReference: string;
  testReference: string;
  since: string;
}

export interface ComponentManifest {
  schemaVersion: number;
  package: string;
  components: ComponentManifestEntry[];
}

export const componentManifest = manifestData as ComponentManifest;
