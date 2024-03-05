import { QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'
import { TodoView } from './todo/TodoView'
import { queryClient } from './QueryClient'
import styled from 'styled-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserView } from './user/UserView'

function App() {
    const [count, setCount] = useState(3);
    return (
        <QueryClientProvider client={queryClient}>
            <StyledLayout>
                <button onClick={() => setCount(count+1)}>Add UserView</button>
                <h1>USER</h1>
                {Array.from({length: count}, (v,index) => <UserView key={index} />)}
                {/*<h1>TODO LIST</h1>*/}
                {/*<TodoView />*/}
            </StyledLayout>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

const StyledLayout = styled.div`
    width: 40rem;
    margin: 3rem auto;
    background-color: aliceblue;
    box-shadow: 1rem 1rem 1rem #949494;
    padding: 1rem;
`

export default App
