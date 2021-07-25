import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom"

import LedgerEntry from '../../components/ledger-entry'
import LedgerBalance from '../../components/ledger-balance'

import { apiFetch } from '../../modules/api-fetch'
import HomeButton from '../../ui/home-button'

import { defaultValues } from '../../form-helpers/defaultEntryValues'

function ShortTermLedger({ match }) {
  const [values, setValues] = useState(defaultValues)
  const [ledger, setLedger] = useState({})
  const [users, setUsers] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`ledger/short/${match.params.id}`).then((json) => {
      const shortLedger = json[0]
      setUsers(shortLedger.users)
      setLedger(shortLedger)
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

  return <div className="container-wrapper">
    {error && <span className="error">{error}</span>}
    <HomeButton />
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
        <LedgerBalance
          props={ledger}
          users={users} />
      </div>
    ) : (
      <div>No Ledger Entries</div>
    )}
  </div>
}

export default withRouter(ShortTermLedger)
