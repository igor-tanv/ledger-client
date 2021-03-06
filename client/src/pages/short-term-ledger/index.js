import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom"
import Button from '@material-ui/core/Button';

import LedgerEntry from '../../components/ledger-entry'
import LedgerTable from '../../components/ledger-table'
import LedgerBalance from '../../components/ledger-balance'

import { apiFetch } from '../../modules/api-fetch'
import { usersToObject } from '../../modules/users-to-object'

import { defaultValues } from '../../form-helpers/defaultEntryValues'

function ShortTermLedger({ match }) {
  const [values, setValues] = useState(defaultValues)
  const [users, setUsers] = useState('')
  const [ledger, setLedger] = useState([])
  const [error, setError] = useState('')


  useEffect(() => {
    apiFetch(`ledger/short/${match.params.id}`).then((json) => {
      const { ledger, transactions } = json
      setUsers(ledger.users)
      setLedger(transactions)
    })
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    apiFetch(`ledger/short/${match.params.id}`, 'post', values)
      .then((json) => {
        setValues(defaultValues)
        const { ledger, transactions } = json
        setLedger(transactions)
        setError('')
      })
      .catch((error) => {
        setError(`Server Error: ${JSON.stringify(error)}`)
      });
  }

  function clearActiveLedger(e) {
    if (window.confirm("Make sure everyone has paid their share before closing this ledger.")) {
      e.preventDefault();
      apiFetch(`ledger/short/delete/${match.params.id}`, 'post')
        .then((json) => {
          window.location.href = `/`
        })
        .catch((error) => {
          setError({ error })
        });
    }
  }

  const title = Object.values(usersToObject(users)).reduce((acc, cur) => acc += ' ' + cur, ' ')

  return <div className="container-wrapper">
    <h1>Short Ledger For: {title}</h1>
    <div>{error && <span className="error">{error}</span>}</div>
    <Button
      onClick={clearActiveLedger}
      variant='contained'
      color='primary'>
      Clear This Ledger
    </Button>
    <div className="ledger-entry">
      <LedgerEntry
        values={values}
        setValues={setValues}
        users={users}
        handleSubmit={handleSubmit}
      />
    </div>
    {ledger.length > 0 ? (
      <div>
        <LedgerBalance props={ledger} users={users} />
        <LedgerTable props={ledger} users={users} />
      </div>
    ) : (
      <div>No Ledger Entries</div>
    )}
  </div>
}

export default withRouter(ShortTermLedger)
