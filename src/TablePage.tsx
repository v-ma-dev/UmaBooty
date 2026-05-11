import { useMemo, useRef, useState } from 'react'
import profilesJson from './assets/data/profiles.json'
import rickeyAudio from './assets/data/RICKEY.mp3'
import './TablePage.css'

type Profile = {
  name: string
  url: string
  height: string
  three_sizes: string
  W: string | null
  H: string | null
}

const profiles = (profilesJson as Profile[]).filter(
  (profile) => profile.three_sizes !== '???',
)

type SortKey = 'name' | 'height' | 'W' | 'H' | 'ratio'
type SortDirection = 'asc' | 'desc'

const columns: Array<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'height', label: 'Height' },
  { key: 'W', label: 'W' },
  { key: 'H', label: 'H' },
  { key: 'ratio', label: 'H/W' },
]

const getHipWaistRatio = (profile: Profile) => {
  const hips = Number(profile.H)
  const waist = Number(profile.W)

  return (hips / waist).toFixed(4)
}

const getSortValue = (profile: Profile, key: SortKey) => {
  if (key === 'name') {
    return profile.name
  }

  if (key === 'height') {
    return Number.parseFloat(profile.height)
  }

  if (key === 'ratio') {
    return Number(profile.H) / Number(profile.W)
  }

  return Number(profile[key])
}

function TablePage() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const rickeyAudioRef = useRef<HTMLAudioElement>(null)

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((firstProfile, secondProfile) => {
      const firstValue = getSortValue(firstProfile, sortKey)
      const secondValue = getSortValue(secondProfile, sortKey)
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1

      if (typeof firstValue === 'string' && typeof secondValue === 'string') {
        return firstValue.localeCompare(secondValue) * directionMultiplier
      }

      return (Number(firstValue) - Number(secondValue)) * directionMultiplier
    })
  }, [sortDirection, sortKey])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const playRickeyAudio = (profileName: string) => {
    if (profileName !== 'Copano Rickey') {
      return
    }

    const audio = rickeyAudioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = 0
    void audio.play().catch(() => undefined)
  }

  return (
    <main className="table-page">
      <h1>Uma Musume Hip Waist Ratio</h1>
      <audio ref={rickeyAudioRef} src={rickeyAudio} preload="auto" />

      <div className="profile-table-wrap">
        <table className="profile-table">
          <thead>
            <tr>
              <th scope="col" className="row-number-header">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sortKey === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort(column.key)}
                  >
                    <span>{column.label}</span>
                    <span className="sort-indicator" aria-hidden="true">
                      {sortKey === column.key
                        ? sortDirection === 'asc'
                          ? '^'
                          : 'v'
                        : '-'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProfiles.map((profile, index) => (
              <tr key={profile.name}>
                <td className="row-number-cell">{index + 1}</td>
                <td>
                  <a
                    className="profile-link"
                    href={profile.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => playRickeyAudio(profile.name)}
                    onFocus={() => playRickeyAudio(profile.name)}
                  >
                    {profile.name}
                  </a>
                </td>
                <td>{profile.height}</td>
                <td>{profile.W}</td>
                <td>{profile.H}</td>
                <td className="ratio-cell">{getHipWaistRatio(profile)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default TablePage
