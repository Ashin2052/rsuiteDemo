export const defaultColumns = [
    {
        key: 'id',
        label: 'Id',
        fixed: true,
        width: 0,
    },
    {
        key: 'name',
        label: 'Team Name',
        fixed: true,
        width: 250,
        sortable:true
        // flexGrow: 1,
    },
    {
        key: 'status',
        label: 'Status',
        fixed: true,
        width: 250,
        sortable:true
        // flexGrow: 1,
    },
    {
        key: 'timeline',
        label: 'Project timeline',
        minWidth: 600,
        width: 600,
        sortable:true,
        flexGrow: 1
    },
    {
        key: 'projectLeader',
        label: 'Project Leader',
        width: 100,
        sortable:true
        // flexGrow: 1


    },
    {
        key: 'category',
        label: 'Category',
        width: 175,
        sortable:true
        // flexGrow: 1,

    },
    {
        key: 'accountManager',
        label: 'Account Manager',
        width: 100,
        sortable:true
        // flexGrow: 1


    },
    {
        key: 'relationshipManager',
        label: 'Relationship Manager',
        width: 100,
        sortable:true

        // flexGrow: 1

    }
];
