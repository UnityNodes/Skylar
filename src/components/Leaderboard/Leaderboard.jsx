import React from 'react';
import { useUser } from '../../contexts/UserContext';
import './Leaderboard.css';

const Leaderboard = () => {
    const { getTopUsers } = useUser();
    
    // Get real users from context and sort by earnings
    const allUsers = getTopUsers()
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .map((user, index) => ({
            ...user,
            position: index + 1,
            amount: user.totalEarnings || 0
        }));

    // Top 5 players for cards
    const topPlayers = allUsers.slice(0, 5);
    
    // Other players for table
    const otherPlayers = allUsers.slice(5);



    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <img src="/Leaderboard.png" alt="Leaderboard" className="leaderboard-title" />
                <img src="/Season 1.png" alt="Season 1" className="season-title" />
            </div>

            {allUsers.length === 0 ? (
                <div className="empty-leaderboard">
                    <p>No players yet. Be the first to play and earn $LINA!</p>
                </div>
            ) : (
                <>
                    <div className="top-players">
                        {topPlayers.map((player) => (
                    <div key={player.id} className={`top-player-card position-${player.position}`}>
                        <div className="player-avatar-container">
                             <img
                                src="/lite.png"
                                alt="Lite decoration"
                                className="lite-decoration"
                             />
                            <img
                                src={`/${player.position}.png`}
                                alt={`Wreath ${player.position}`}
                                className="wreath-left"
                            />
                            <img
                                src={`/${player.position}.png`}
                                alt={`Wreath ${player.position}`}
                                className="wreath-right"
                            />
                            <div className="player-avatar">
                                {player.avatar ? (
                                    <img src={player.avatar} alt={player.name} className="avatar-image" />
                                ) : (
                                    <div className="avatar-circle">
                                        <span>{player.initials || player.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <img
                            src="/st.png"
                            alt="Star decoration"
                            className="star-decoration"
                        />
                        <img
                            src={`/f${player.position}.png`}
                            alt={`Position ${player.position}`}
                            className="position-badge-image"
                        />
                        <div className="player-name">{player.name}</div>
                        <div className="player-amount">
                            <span className="amount">{player.amount}</span>
                            <span className="currency">$LINA</span>
                        </div>
                        <div className="player-subtitle">Total earnings</div>
                    </div>
                ))}
            </div>

                    {otherPlayers.length > 0 && (
                        <div className="leaderboard-table">
                            {otherPlayers.map((player) => (
                                <div key={player.id} className="table-row">
                                    <div className="row-position">#{player.position}</div>
                                    <div className="row-player">
                                        <div className="row-avatar">
                                            {player.avatar ? (
                                                <img src={player.avatar} alt={player.name} className="row-avatar-image" />
                                            ) : (
                                                <span>{player.initials || player.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="row-name">{player.name}</span>
                                    </div>
                                    <div className="row-amount">
                                        <span className="amount">{player.amount}</span>
                                        <span className="currency">$LINA</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Leaderboard;