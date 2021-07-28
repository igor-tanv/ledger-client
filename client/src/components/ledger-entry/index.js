import React from "react";
import ReactDropdown from "react-dropdown"
import DatePicker from 'react-date-picker';

import { TextField, Button } from '@material-ui/core'

import { formatDropdown } from '../../modules/format-dropdown'
import { usersToObject } from '../../modules/users-to-object'
import { validateEntries } from '../../modules/validate-entries'

import 'react-dropdown/style.css';
import './styles.css'

export default function LedgerEntry({ values, setValues, users, handleSubmit }) {

  function updateCost(e) {
    let cost = parseInt(e.target.value.replace(/,/g, '')) || 0;
    setValues((prev) => ({
      ...prev,
      cost
    }))
  };

  function updateUser(e) {
    let user = e.value
    setValues((prev) => ({
      ...prev,
      user,
    }))
  };

  function updateItem(e) {
    let item = e.target.value
    setValues((prev) => ({
      ...prev,
      item,
    }))
  };

  function updateDate(e) {
    setValues((prev) => ({
      ...prev,
      purchaseDate: e
    }))
  };

  return (
    <div className="ledger-entry">
      <form onSubmit={handleSubmit} autoComplete="off">
        <ReactDropdown
          id='select'
          className="dropdown-wrapper"
          options={formatDropdown(usersToObject(users))}
          onChange={updateUser}
          placeholder="Select a user"
          value={values.user}
        />

        <TextField
          variant='outlined'
          color='secondary'
          type="text"
          onChange={updateCost}
          value={values.cost.toLocaleString()}
        />
        <TextField
          variant='outlined'
          color='secondary'
          onChange={updateItem}
          value={values.item}
          placeholder="enter item description"
        />
        <DatePicker
          onChange={updateDate}
          value={values.purchaseDate}
          dateFormat="MMMM d, yyyy"
        />

        <Button
          variant='contained'
          color='primary'
          type="submit"
          disabled={validateEntries(values)}>
          Submit to Ledger
        </Button>
      </form>
    </div>
  )
}