import create from 'zustand'

export enum CONTRIBUTION_STATE {
	WAITING = 'TryContributeError::AnotherContributionInProgress',
}

export type ContributionStore = {
	status: CONTRIBUTION_STATE
	setStatus: (status: CONTRIBUTION_STATE) => void
}

const useContributionStore = create<ContributionStore>()((set, get) => ({
	status: null,
	setStatus: (status: CONTRIBUTION_STATE) => set({ status }),
}))

export default useContributionStore
