import React, { useEffect, useState } from "react";

import LedgerEntry from '../../components/ledger-entry'
import LedgerTable from '../../components/ledger-table'
import LedgerBalance from '../../components/ledger-balance'

import { apiFetch } from '../../modules/api-fetch'

import { defaultValues } from '../../form-helpers/defaultEntryValues'

import './styles.css'

export default function LongTermLedger() {
  const [values, setValues] = useState(defaultValues)
  const [users, setUsers] = useState('')
  const [ledger, setLedger] = useState([])
  const [error, setError] = useState('')

  console.log(users, 19)


  useEffect(() => {
    apiFetch('').then((json) => {
      setLedger(json)
    })
    apiFetch('users').then((json) => {
      setUsers(json.users)
    })
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    apiFetch(`ledger`, 'post', values)
      .then((json) => {
        setValues(defaultValues)
        apiFetch('').then((json) => {
          setLedger(json)
        });
      })
      .catch((error) => {
        setError(error)
      });
  }

  function clearActiveLedger(e) {
    e.preventDefault();
    apiFetch(`ledger/clear`, 'post')
      .then((json) => {
        setLedger(json)
      })
      .catch((error) => {
        setError(error)
      });
  }

  return <div className="container-wrapper">
    <h1>The Crown Ledger</h1>
    {error && <span className="error">{error}</span>}
    <button onClick={clearActiveLedger}>Clear Ledger Entries</button>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = '/short/new';
      }}
    >
      Create Short-Term Ledger
    </button>

    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = '/short';
      }}
    >
      Active Short-Term Ledgers
    </button>

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
