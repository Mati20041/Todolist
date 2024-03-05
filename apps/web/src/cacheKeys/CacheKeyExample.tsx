import {useQuery, useQueryClient} from "@tanstack/react-query";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const load = async (id: number, sorting: 'ASC' | 'DSC', page: number) => {
    await wait(1000);
    return `hello ${id}`
}

export const CacheKeyExample = ({id, sorting, page}: {id: number, sorting: 'ASC' | 'DSC', page: number}) => {
    const queryClient = useQueryClient()

    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['cache-example', id, { sorting, page}],
        queryFn: () => load(id, sorting, page),
    })
    return <div style={{margin: '1rem'}}>
        <button onClick={() => {queryClient.invalidateQueries(['cache-example'])}}>Clear all</button>
        <button onClick={() => {queryClient.invalidateQueries(['cache-example', id])}}>Clear all my id</button>
        <button onClick={() => {queryClient.invalidateQueries(['cache-example', id, {sorting: 'ASC'}])}}>Clear me ASC</button>
        <button onClick={() => {queryClient.invalidateQueries(['cache-example', id, { sorting, page }])}}>Clear me</button>
        <label>{JSON.stringify({id, sorting, page, data, isFetching, isLoading})}</label>
    </div>
}