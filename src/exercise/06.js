// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//       // return (
//       //   <div role="alert">
//       //     There was an error:{' '}
//       //     <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
//       //   </div>
//       // )
//     }
//     return this.props.children
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName = ''}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({
    status: 'idle',
    error: null,
    pokemon: null,
  })

  const {status, pokemon, error} = state
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (pokemonName !== '') {
      setState({status: 'pending'})
      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setState({
            pokemon: pokemonData,
            status: 'resolved',
          })
        })
        .catch(err => {
          setState({
            error: err,
            status: 'rejected',
          })
        })
    }
  }, [pokemonName])
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  // fetchPokemon('Pikachu').then(
  //   pokemonData => { /* update all the state here */},
  // )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if (status === 'idle') {
    return 'Submit a pokemon'
  }
  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
  if (status === 'rejected') {
    throw error
  }
  throw new Error('Error: This error should never happen')
  // if (error) {
  //   return (
  //     <div role="alert">
  //       There was an error:{' '}
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }
  // if (pokemonName === '') {
  //   return 'Submit a pokemon'
  // }
  // // 💣 remove this
  // return pokemon ? (
  //   <PokemonDataView pokemon={pokemon} />
  // ) : (
  //   <PokemonInfoFallback name={pokemonName} />
  // )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
