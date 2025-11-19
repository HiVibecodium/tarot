              {/* Mercury - 4th Point */}
              {astroData.astrologyProfile.planets?.mercury && (() => {
                const sign = astroData.astrologyProfile.planets.mercury.sign;
                const mercuryData = MERCURY_IN_SIGNS[sign];
                return mercuryData && (
                  <div className="interpretation-block expandable fourth-point">
                    <div className="block-header" onClick={() => toggleSection('mercury-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge fourth">Ваш Ум</div>
                        <h4>☿ Меркурий в {sign} - {mercuryData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('mercury-key'); }}>
                        {expandedSections['mercury-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы думаете и общаетесь:</strong> {mercuryData.description}
                    </p>
                    {expandedSections['mercury-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box mercury-box">
                          <h5>☿ Ваш Стиль Мышления и Коммуникации:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            {mercuryData.description}
                          </div>
                        </div>
                        <div className="traits-grid">
                          <div className="trait-box positive">
                            <h5>✨ Сильные Стороны:</h5>
                            <ul>
                              {mercuryData.communicationStyle.strengths.slice(0, 3).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="trait-box negative">
                            <h5>⚡ Вызовы:</h5>
                            <ul>
                              {mercuryData.communicationStyle.challenges.slice(0, 3).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Venus - 5th Point */}
              {astroData.astrologyProfile.planets?.venus && (() => {
                const sign = astroData.astrologyProfile.planets.venus.sign;
                const venusData = VENUS_IN_SIGNS[sign];
                return venusData && (
                  <div className="interpretation-block expandable fifth-point">
                    <div className="block-header" onClick={() => toggleSection('venus-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge fifth">Ваша Любовь</div>
                        <h4>♀ Венера в {sign} - {venusData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('venus-key'); }}>
                        {expandedSections['venus-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы любите и цените:</strong> {venusData.description}
                    </p>
                    {expandedSections['venus-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box venus-box">
                          <h5>♀ Ваш Стиль Любви и Ценностей:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            {venusData.description}
                          </div>
                        </div>
                        <div className="traits-grid">
                          <div className="trait-box positive">
                            <h5>💕 В Отношениях:</h5>
                            <ul>
                              {venusData.relationships.positives.slice(0, 3).map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="trait-box negative">
                            <h5>⚡ Вызовы:</h5>
                            <ul>
                              {venusData.relationships.challenges.slice(0, 3).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
