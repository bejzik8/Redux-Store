import { get } from 'lodash';

export const sortByFullName = (rowA, rowB) => {
    const nameA = get(rowA, 'original.firstName') || '';
    const nameB = get(rowB, 'original.firstName') || '';
    const nameComparation = nameA.localeCompare(nameB);

    if (nameComparation !== 0) {
        let aNameIsAlphabetical = nameA.localeCompare('a') >= 0;
        let bNameIsAlphabetical = nameB.localeCompare('a') >= 0;

        if (!aNameIsAlphabetical && bNameIsAlphabetical)
            return 1;
        if (aNameIsAlphabetical && !bNameIsAlphabetical)
            return -1;

        return nameA.localeCompare(nameB);
    } else {
        const lastNameA = get(rowA, 'original.lastName') || '';
        const lastNameB = get(rowB, 'original.lastName') || '';

        let aLastNameIsAlphabetical = nameA.localeCompare('a') >= 0;
        let bLastNameIsAlphabetical = nameB.localeCompare('a') >= 0;

        if (!aLastNameIsAlphabetical && bLastNameIsAlphabetical)
            return 1;
        if (aLastNameIsAlphabetical && !bLastNameIsAlphabetical)
            return -1;

        return lastNameA.localeCompare(lastNameB);
    }
};

export const sortByLocation = (rowA, rowB) => {
    const locationA = (get(rowA, 'original.location') || get(rowA, 'original.country')) || '';
    const locationB = (get(rowB, 'original.location') || get(rowB, 'original.country')) || '';

    let aIsAlphabetical = locationA.localeCompare('a') >= 0;
    let bIsAlphabetical = locationB.localeCompare('a') >= 0;

    if (!aIsAlphabetical && bIsAlphabetical)
        return 1;
    if (aIsAlphabetical && !bIsAlphabetical)
        return -1;

    return locationA.localeCompare(locationB);
};

export const sortByHeadline = (rowA, rowB) => {
    const jobA = get(rowA, 'original.headline') || '';
    const jobB = get(rowB, 'original.headline') || '';

    let aIsAlphabetical = jobA.localeCompare('a') >= 0;
    let bIsAlphabetical = jobB.localeCompare('a') >= 0;

    if (!aIsAlphabetical && bIsAlphabetical)
        return 1;
    if (aIsAlphabetical && !bIsAlphabetical)
        return -1;

    return jobA.localeCompare(jobB);
};

export const sortByEmail = (rowA, rowB) => {
    const jobA = get(rowA, 'original.email') || '';
    const jobB = get(rowB, 'original.email') || '';

    let aIsAlphabetical = jobA.localeCompare('a') >= 0;
    let bIsAlphabetical = jobB.localeCompare('a') >= 0;

    if (!aIsAlphabetical && bIsAlphabetical)
        return 1;
    if (aIsAlphabetical && !bIsAlphabetical)
        return -1;

    return jobA.localeCompare(jobB);
};

export const tagSortByName = (rowA, rowB) => {
    const tagA = get(rowA, 'original.title') || '';
    const tagB = get(rowB, 'original.title') || '';

    let aIsAlphabetical = tagA.localeCompare('a') >= 0;
    let bIsAlphabetical = tagB.localeCompare('a') >= 0;

    if (!aIsAlphabetical && bIsAlphabetical)
        return 1;
    if (aIsAlphabetical && !bIsAlphabetical)
        return -1;

    return tagA.localeCompare(tagB);
};

export const tagSortByTagged = (rowA, rowB) => {
    const tagA = get(rowA, 'original.connectionsCount') || 0;
    const tagB = get(rowB, 'original.connectionsCount') || 0;

    return tagA - tagB;
};

export const tagSortByDate = (rowA, rowB) => {
    const tagA = get(rowA, 'original.createdAt') || 0;
    const tagB = get(rowB, 'original.createdAt') || 0;

    return Date.parse(tagA) - Date.parse(tagB);
};