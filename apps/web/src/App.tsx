import { QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'
import { TodoView } from './todo/TodoView'
import { queryClient } from './QueryClient'
import styled from 'styled-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserView } from './user/UserView'
import { UserListener } from './user/useUser'
import {UserAge} from "./user/UserAge";
import {CacheKeyExample} from "./cacheKeys/CacheKeyExample";

function App() {
    const [count, setCount] = useState(3)
    const [show, setShow] = useState(true)
    return (
        <QueryClientProvider client={queryClient}>
            <StyledLayout>
                <h1>Cache Keys</h1>
                <CacheKeyExample id={1} sorting="ASC" page={1} />
                <CacheKeyExample id={1} sorting="DSC" page={1} />
                <CacheKeyExample id={1} sorting="ASC" page={2} />
                <CacheKeyExample id={2} sorting="ASC" page={1} />
                <CacheKeyExample id={2} sorting="DSC" page={1} />
                <CacheKeyExample id={2} sorting="ASC" page={2} />

                {/*<button onClick={() => setCount(count + 1)}>*/}
                {/*    Add UserView*/}
                {/*</button>*/}
                {/*<button onClick={() => setShow(!show)}>toggle listener</button>*/}
                {/*<h1>USER</h1>*/}
                {/*<UserAge/>*/}
                {/*{show && (*/}
                {/*    <UserListener>*/}
                {/*        {Array.from({ length: count }, (v, index) => (*/}
                {/*            <UserView key={index} />*/}
                {/*        ))}*/}
                {/*    </UserListener>*/}
                {/*)}*/}
                {/*<h1>TODO LIST</h1>*/}
                {/*<TodoView />*/}
            </StyledLayout>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

const StyledLayout = styled.div`
    width: 80rem;
    margin: 3rem auto;
    background-color: aliceblue;
    box-shadow: 1rem 1rem 1rem #949494;
    padding: 1rem;
`

export default App
