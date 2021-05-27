import { createSelector } from 'reselect';
import { get } from 'lodash';

const getConnections = (state) => get(state, 'connections.connections') || [];
const getFilters = (state) => get(state, 'connections.filters') || '';
const getAllTags = (state) => get(state, 'tags.allTags') || [];

export const getFilteredConnections = createSelector(
    [getConnections, getFilters],
    (allConnections, filters) => {
        let filteredConnections = filters.selectedTags.length ? filterByTags(allConnections, filters.selectedTags) : allConnections;

        return filteredConnections;
    }
);

export const getTagSelectOptions = createSelector(
    [getAllTags],
    allTags => {
        const compare = (rowA, rowB) => {
            const tagA = rowA.title || '';
            const tagB = rowB.title || '';
        
            let aIsAlphabetical = tagA.localeCompare('a') >= 0;
            let bIsAlphabetical = tagB.localeCompare('a') >= 0;
        
            if (!aIsAlphabetical && bIsAlphabetical)
                return 1;
            if (aIsAlphabetical && !bIsAlphabetical)
                return -1;
        
            return tagA.localeCompare(tagB);
        };

        let mappedTags = allTags.map(tag => ({
            label: tag.title,
            title: tag.title,
            value: tag.title,
            id: tag._id,
            color: tag.color
        }));

        mappedTags.sort(compare);

        return mappedTags;
    }
);

export const getTagSelectOptionsForContact = (profileId) => createSelector(
    [getConnections],
    connections => {
        let connection = connections.find(connection => connection._id === profileId);

        if (connection.tags.length) {
            return connection.tags.map(connection => ({
                label: connection.title,
                title: connection.title,
                value: connection.title,
                color: connection.color,
                id: connection._id
            }))
        }
    }
);

export const getNumberOfActiveFilters = createSelector(
    [getFilters],
    filters => {
        let numberOfActiveFilters = 0;

        filters.selectedTags.length && numberOfActiveFilters++;

        return numberOfActiveFilters;
    }
);

export const getNumberOfSelectedTags = createSelector(
    [getFilters],
    filters => { return filters.selectedTags.length }
);

const filterByTags = (connections, selectedTags) => {
    const filteredConnections = connections.filter(connection => {
        if (!connection.tags) {
            return false
        }

        return connection.tags.some(tag => {
            return selectedTags.find(selectedTag => selectedTag.title === tag.title)
        })
    })

    return filteredConnections;
}
